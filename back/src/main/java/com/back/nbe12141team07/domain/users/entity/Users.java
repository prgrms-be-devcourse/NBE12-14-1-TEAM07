package com.back.nbe12141team07.domain.users.entity;

import com.back.nbe12141team07.global.jpa.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Users extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String email;
    private String role;

    public Users(String email, String role) {
        this.email = email;
        this.role = role;
    }
}