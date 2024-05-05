interface UserProps {
  id: string
  password: string
}

export class User implements UserProps {
  id: string
  password: string

  constructor (props: UserProps) {
    this.id = props.id
    this.password = props.password
  }


  updatePassword (password: string): void {
    this.password = password
  }
}