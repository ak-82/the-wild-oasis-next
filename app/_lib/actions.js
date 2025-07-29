"use server"

import {auth, signIn, signOut} from "@/app/_lib/auth";
import {supabase} from "@/app/_lib/supabase";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth()
  if (!session) throw new Error("you are not logged in")
  const nationalID = formData.get("nationalID")
  const [nationality, countryFlag] = formData.get("nationality").split("%")
  if (!/^[0-9]{10}$/.test(nationalID)) throw new Error("Your national ID is invalid , a valid ID sample : 0123456789")
  const updateData = {nationality, nationalID, countryFlag};
  const {data, error} = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)

  if (error)
    throw new Error('Guest could not be updated');

  revalidatePath("/account/profile")
}

export async function createReservation(bookingData, formData) {
  const session = await auth()
  if (!session) throw new Error("you are not logged in")

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed"
  }

  const {error} = await supabase
    .from('bookings')
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`)
  redirect("/cabins/thankYou")
}

export async function deleteReservation(bookingId) {
  const session = await auth()
  if (!session) throw new Error("you are not logged in")

  const {error} = await supabase.from('bookings').delete().eq('id', bookingId);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  revalidatePath("/account/reservations")
}

export async function updateReservation(formData) {
  const session = await auth()
  if (!session) throw new Error("you are not logged in")
  const numGuests = formData.get("numGuests")
  const bookingId = formData.get("bookingId")
  const observations = formData.get("observations").slice(0, 1000)
  const updatedFields = {numGuests, observations};
  const {error} = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  revalidatePath(`/account/reservations/edit/${bookingId}`)
  redirect("/account/reservations")
}

export async function signInAction() {
  await signIn("google", {redirectTo: "/account"});
}

export async function signOutAction() {
  await signOut({redirectTo: "/"});
}