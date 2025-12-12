"use client";

import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <AuthLayout
      title={t('welcomeBack') || "Welcome Back"}
      subtitle={t('enterCredentials') || "Sign in to access your dashboard"}
    >
      <LoginForm />
    </AuthLayout>
  );
}