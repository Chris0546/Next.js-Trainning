export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export function validateSignupForm(name: string, email: string, password: string) {
  const errors: { name?: string[]; email?: string[]; password?: string[] } = {}

  // Naam validatie
  if (!name || name.trim().length < 2) {
    errors.name = ['Naam moet minimaal 2 tekens bevatten.']
  }

  // E-mail validatie
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email.trim())) {
    errors.email = ['Voer een geldig e-mailadres in.']
  }

  // Wachtwoord validatie
  const passwordErrors: string[] = []
  if (!password || password.trim().length < 8) {
    passwordErrors.push('Moet minimaal 8 tekens lang zijn.')
  }
  if (!/[a-zA-Z]/.test(password)) {
    passwordErrors.push('Moet minimaal één letter bevatten.')
  }
  if (!/[0-9]/.test(password)) {
    passwordErrors.push('Moet minimaal één cijfer bevatten.')
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    passwordErrors.push('Moet minimaal één speciaal teken bevatten.')
  }
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors
  }

  // Retourneer null als er geen fouten zijn, anders het errors-object
  return Object.keys(errors).length > 0 ? errors : null
}