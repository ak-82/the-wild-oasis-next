"use client"

import {useOptimistic} from "react";
import ReservationCard from "@/app/_components/ReservationCard";
import {deleteReservation} from "@/app/_lib/actions";

export default function ReservationList({bookings}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(bookings, (currBookings,bookingId) => {
    return currBookings.filter((booking) => booking.id !== bookingId)
  })

  async function handleDeleteReservation(bookingId) {
    optimisticDelete(bookingId)
    await deleteReservation(bookingId);
  }

  return <ul className="space-y-6">
    {optimisticBookings.map((booking) => (
      <ReservationCard onDelete={handleDeleteReservation} booking={booking} key={booking.id}/>
    ))}
  </ul>
}