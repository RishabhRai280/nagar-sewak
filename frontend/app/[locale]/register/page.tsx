"use client";

import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('auth.register');

  return (
    <AuthLayout
      title={t('createAccount') || "Create Account"}
      subtitle={t('joinCommunity') || "Join the Nagar Sewak platform today"}
      theme="green"
    >
      <RegisterForm />
    </AuthLayout>
  );
}