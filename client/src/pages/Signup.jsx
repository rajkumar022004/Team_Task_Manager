import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAuthForm, validators } from '../hooks/useAuthForm';
import FormField from '../components/auth/FormField';
import AuthAlert from '../components/auth/AuthAlert';

const signupRules = {
  name: [
    validators.required('Full name is required'),
    validators.minLength(2, 'Name must be at least 2 characters'),
    validators.maxLength(100, 'Name cannot exceed 100 characters'),
  ],
  email: [
    validators.required('Email is required'),
    validators.email,
  ],
  password: [
    validators.required('Password is required'),
    validators.minLength(6, 'Password must be at least 6 characters'),
  ],
  confirmPassword: [
    validators.required('Please confirm your password'),
    validators.match('password', 'Passwords do not match'),
  ],
};

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setApiErrors,
  } = useAuthForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    signupRules
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateAll()) return;

    setLoading(true);

    try {
      await signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      toast.success('Account created successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Signup failed');
      toast.error(err.message || 'Signup failed');
      if (err.errors) setApiErrors(err.errors);
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="card shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
        <p className="mt-2 text-sm text-slate-600">Start managing team tasks in minutes</p>
      </div>

      <AuthAlert message={apiError} />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <FormField
          label="Full name"
          id="name"
          name="name"
          type="text"
          placeholder="Jane Doe"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          autoComplete="name"
          icon={<UserIcon />}
        />

        <FormField
          label="Email address"
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          touched={touched.email}
          autoComplete="email"
          icon={<EmailIcon />}
        />

        <FormField
          label="Password"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 6 characters"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          touched={touched.password}
          autoComplete="new-password"
          icon={<LockIcon />}
          rightElement={
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((p) => !p)} />
          }
        />

        <FormField
          label="Confirm password"
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          autoComplete="new-password"
          icon={<LockIcon />}
          rightElement={
            <PasswordToggle
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((p) => !p)}
            />
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-base shadow-md shadow-primary-500/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
