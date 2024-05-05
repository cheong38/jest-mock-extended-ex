import { UserRepository } from './UserRepository'
import { PasswordHasher } from './PasswordHasher'
import { UpdateUserPasswordRequest } from './UpdateUserPasswordRequest'
import { UpdateUserPasswordExceptions } from './UpdateUserPasswordExceptions'

export class UpdateUserPasswordUseCase {
  constructor (private readonly userRepository: UserRepository, private readonly passwordHasher: PasswordHasher) {
  }

  async execute (request: UpdateUserPasswordRequest): Promise<void> {
    const { id, password } = request

    const user = await this.userRepository.findOneById(id)
    if (!user) {
      throw new UpdateUserPasswordExceptions.UserNotFoundException()
    }

    const hashedPassword = await this.passwordHasher.hash(password)
    user.updatePassword(hashedPassword)
    await this.userRepository.save(user)
  }
}
