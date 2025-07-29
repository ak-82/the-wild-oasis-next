"use client"

import {usePathname, useSearchParams, useRouter} from "next/navigation";

export default function Filter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const capacity = searchParams.get("capacity") ?? "all"
  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams)
    params.set("capacity", filter)
    router.replace(`${pathname}?${params.toString()}`, {scroll: false})
  }

  return <div className="border border-primary-800 flex">
    <button className={`px-5 py-2 hover:bg-primary-700 ${capacity === "all" ? "bg-primary-700" : ""}`} onClick={() => handleFilter('all')}>All cabins</button>
    <button className={`px-5 py-2 hover:bg-primary-700 ${capacity === "small" ? "bg-primary-700" : ""}`} onClick={() => handleFilter('small')}>1&mdash;3 guests</button>
    <button className={`px-5 py-2 hover:bg-primary-700 ${capacity === "medium" ? "bg-primary-700" : ""}`} onClick={() => handleFilter('medium')}>4&mdash;7 guests</button>
    <button className={`px-5 py-2 hover:bg-primary-700 ${capacity === "large" ? "bg-primary-700" : ""}`} onClick={() => handleFilter('large')}>8&mdash;15 guests</button>
  </div>
}