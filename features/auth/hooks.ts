"use client";

import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  login,
  register,
} from "./api";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}