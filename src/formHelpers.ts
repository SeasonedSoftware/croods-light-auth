import get from "lodash/get";
import compact from "lodash/compact";
import head from "lodash/head";
import objValues from "lodash/values";
import { FormState } from "./typeDeclarations";
import { Inputs } from "react-use-form-state";

// eslint-disable-next-line
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface Validator {
  (a: string, b?: object[]): undefined | string;
}

interface CommonFieldsInterface {
  [name: string]: [string, string, Validator[]];
}

export const validate = (validators: Validator[]): Validator => (
  value,
  values
) => head(compact(validators.map((validator) => validator(value, values))));

export const confirmation = (
  name: string,
  message = `Must be equal to ${name}`
): Validator => (value, values) => {
  if (value !== get(values, name)) {
    return message;
  }
  return undefined;
};

export const presence = (message = "Is required"): Validator => (value) =>
  value ? undefined : message;

export const email = (message = "Invalid email"): Validator => (value) =>
  value && !EMAIL_REGEX.test(value) ? message : undefined;

export const minLength = (
  chars: number,
  message = `Minimum ${chars} characters`
): Validator => (value) =>
  value && value.trim().length < chars ? message : undefined;

export const getFieldError = (formState: FormState) => (
  name: string
): string | undefined => get(formState, `errors.${name}`);

export const getFieldProps = (
  fields: Inputs<any, string | number | symbol>,
  formState: FormState
) => (type: string, name: string, validators: Validator[] = []) => {
  const fieldError = getFieldError(formState);
  return {
    ...get(fields, type)({ name, validate: validate(validators) }),
    error: fieldError(name),
  };
};

export const isValidForm = (
  formState: FormState,
  additionalCheck: Function = () => true
): boolean =>
  !compact(objValues(formState.errors)).length && additionalCheck(formState);

export const commonFields: CommonFieldsInterface = {
  email: ["email", "email", [presence(), email()]],
  password: ["password", "password", [presence(), minLength(8)]],
  passwordConfirmation: [
    "password",
    "passwordConfirmation",
    [confirmation("password", "Password fields must be equal")],
  ],
};

export const additionalCheckerPasswordConfirmation = (
  formState: FormState
): boolean => {
  if (formState.values.password === formState.values.passwordConfirmation)
    return true;

  formState.setFieldError &&
    formState.setFieldError(
      "passwordConfirmation",
      "Password fields must be equal"
    );
  return false;
};
