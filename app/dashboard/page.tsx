import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardContent } from "@/components/dashboard-content"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      resumes: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      portfolio: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  return <DashboardContent user={user} />
}
