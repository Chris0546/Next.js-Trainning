import { validateSignupForm, FormState } from '@/app/lib/validation'
import bcrypt from "bcrypt";
import { createSession } from '../lib/session';
import { redirect } from 'next/navigation';


export async function signup(state: FormState, formData: FormData) {
  // 1. Valideer formuliervelden
  // ...
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const errors = validateSignupForm(name, email, password)

  // Als formuliervelden ongeldig zijn, return vroegtijdig
  if (errors) {
    return { errors }
  }

  // 2. Bereid data voor om in de database in te voegen
  // name, email en password zijn al beschikbaar uit de formData
  // Bijvoorbeeld: Hash het wachtwoord van de gebruiker voordat je het opslaat
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Voeg de gebruiker in de database in of roep de API van een Auth Library aan
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'Er is een fout opgetreden bij het aanmaken van je account.',
    }
  }

  // TODO:
  // 4. Maak een gebruikerssessie aan
  await createSession(user.id)
  // 5. Redirect de gebruiker
  redirect('/profile')
}