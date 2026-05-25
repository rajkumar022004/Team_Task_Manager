import { useCallback, useState } from 'react';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const useAuthForm = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (name, value, allValues = values) => {
      const rules = validationRules[name];
      if (!rules) return '';

      for (const rule of rules) {
        const error = rule(value, allValues);
        if (error) return error;
      }

      return '';
    },
    [validationRules, values]
  );

  const validateAll = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, values[name], values);
      if (error) newErrors[name] = error;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    return Object.keys(newErrors).length === 0;
  }, [validationRules, validateField, values]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => {
        const updated = { ...prev, [name]: value };
        if (touched[name]) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value, updated),
          }));
        }
        return updated;
      });
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, values),
      }));
    },
    [validateField, values]
  );

  const setFieldError = useCallback((name, message) => {
    setErrors((prev) => ({ ...prev, [name]: message }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const setApiErrors = useCallback((apiErrors = []) => {
    if (!apiErrors.length) return;

    const fieldErrors = {};
    apiErrors.forEach(({ field, message }) => {
      if (field && field !== '') {
        fieldErrors[field] = message;
      }
    });

    if (Object.keys(fieldErrors).length) {
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setFieldError,
    setApiErrors,
  };
};

export const validators = {
  required: (message) => (value) => (!value?.trim() ? message : ''),
  email: (value) =>
    value && !EMAIL_REGEX.test(value) ? 'Please enter a valid email address' : '',
  minLength: (min, message) => (value) =>
    value && value.length < min ? message : '',
  maxLength: (max, message) => (value) =>
    value && value.length > max ? message : '',
  match: (field, message) => (value, allValues) =>
    value !== allValues[field] ? message : '',
};
