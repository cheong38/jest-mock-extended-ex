import { User } from '../User'

export interface UserRepository {
  save (user: User): Promise<void>

  findOneById (id: string): Promise<User | undefined>
}
