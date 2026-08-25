package com.back.nbe12141team07.domain.user.entity;

import com.back.nbe12141team07.global.jpa.entity.BaseEntity;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class User extends BaseEntity {
    private String email;
    private String role;
}
