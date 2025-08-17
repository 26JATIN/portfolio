"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export function Header() {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY
			const heroHeight = window.innerHeight
			setIsVisible(scrollY < heroHeight * 0.9) // Hide when 90% through hero section
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border border-border flex items-center justify-between transition-all duration-300 px-4 py-3 mx-4 mt-4 rounded-2xl shadow-sm ${
				isVisible
					? "opacity-100 visible"
					: "opacity-0 invisible pointer-events-none"
			}`}
		>
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background font-bold text-sm">
					C
				</div>
				<span className="text-lg font-semibold">Jatin Gupta</span>
			</div>

			<div className="flex items-center gap-4">
				<ThemeToggle />
				<Button className="rounded-full px-4 py-1.5 text-sm bg-foreground text-background hover:bg-foreground/90">
					Book a call
				</Button>
			</div>
		</header>
	)
}
