package com.ninehub.authentication.repository;

import com.ninehub.authentication.entity.Role;
import com.ninehub.authentication.entity.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleType(RoleType roleType);
}