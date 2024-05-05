import { mock, MockProxy } from 'jest-mock-extended'
import { UpdateUserPasswordRequest } from './UpdateUserPasswordRequest'
import { User } from '../User'
import { UpdateUserPasswordExceptions } from './UpdateUserPasswordExceptions'
import { UserRepository } from './UserRepository'
import { PasswordHasher } from './PasswordHasher'
import { UpdateUserPasswordUseCase } from './UpdateUserPasswordUseCase'

describe('UpdateUserPasswordUseCase', () => {
  const USER_ID = 'user-id'
  const PASSWORD = 'new-password'
  const REQUEST: UpdateUserPasswordRequest = {
    id: USER_ID,
    password: PASSWORD
  }

  let userRepository: MockProxy<UserRepository>
  let passwordHasher: MockProxy<PasswordHasher>
  let uut: UpdateUserPasswordUseCase

  beforeEach(() => {
    userRepository = mock()
    passwordHasher = mock()
    uut = new UpdateUserPasswordUseCase(userRepository, passwordHasher)
  })

  it ('throws UserNotFoundException when user is not found by the ID', async () => {
    userRepository.findOneById.mockResolvedValue(undefined)

    const result = uut.execute(REQUEST)

    await expect(result).rejects.toThrow(UpdateUserPasswordExceptions.UserNotFoundException)
    expect(userRepository.findOneById).toHaveBeenCalledWith(USER_ID)
  })

  it ('hashes the password and updates user password when user is found by the ID', async () => {
    userRepository.findOneById.mockResolvedValue(new User({
      id: USER_ID,
      password: 'old-password'
    }))
    passwordHasher.hash.mockResolvedValue('hashed-password')

    await uut.execute(REQUEST)

    expect(passwordHasher.hash).toHaveBeenCalledWith(PASSWORD)
    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      password: 'hashed-password'
    }))
  })
})