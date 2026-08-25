package com.back.nbe12141team07.domain.users.repository;

import com.back.nbe12141team07.domain.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Integer> {
}