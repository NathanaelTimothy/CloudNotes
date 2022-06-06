import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  Table,
} from 'sequelize-typescript'
import {Length, IsEmail} from 'class-validator'
import {Exclude} from 'class-transformer'
import argon2 from 'argon2'

import {ParanoidModel} from './base/ParanoidModel'

@Table
class User extends ParanoidModel {
  @Column
  @Length(2, 50)
  name!: string

  @Column
  @Length(4, 30)
  @IsEmail()
  email!: string

  @Column
  @Exclude()
  @Length(25, 100)
  password!: string

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    instance.password = await argon2.hash(instance.password)
  }
}

export {User}
