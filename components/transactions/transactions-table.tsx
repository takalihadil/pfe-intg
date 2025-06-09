"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { TransactionStatusBadge } from "./transaction-status"
import { TransactionActions } from "./transaction-actions"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"

interface UserData {
  id: string
  projectType: "offline" | "online"
}

export interface Expense {
  id: string
  title: string
  amount: number
  type: "business" | "personal"
  repeat: boolean
  repeatType: "daily" | "weekly" | "monthly" | null
  date: string
  startDate: string | null
  endDate: string | null
  createdAt: string
}

interface Sale {
  id: string
  quantity: number
  date: string
  product: {
    name: string
    price: number
  }
}

interface Invoice {
  id: string
  date: string
  invoice: {
    status: string
    client: {
      name: string
    }
    items: Array<{
      amount: number
    }>
  }
}

type Transaction = 
  | (Expense & { transactionType: 'expense' })
  | (Sale & { transactionType: 'sale' })
  | (Invoice & { transactionType: 'invoice' })

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token")
      try {
        // Get user data
        const meRes = await fetch('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const { sub: userId } = await meRes.json()
        
        const userRes = await fetch(`http://localhost:3000/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const userData: UserData = await userRes.json()

        // Fetch all data
        const [expensesRes, salesRes] = await Promise.all([
          fetch('http://localhost:3000/expenses', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(userData.projectType === 'offline' 
            ? 'http://localhost:3000/sales' 
            : 'http://localhost:3000/sale-digital', {
              headers: { Authorization: `Bearer ${token}` }
            })
        ])

        const expenses: Expense[] = await expensesRes.json()
        const salesOrInvoices = await salesRes.json()

        // Combine and format transactions
        const combined = [
          ...expenses.map(e => ({ ...e, transactionType: 'expense' as const })),
          ...salesOrInvoices.map((t: any) => ({
            ...t,
            transactionType: userData.projectType === 'offline' ? 'sale' : 'invoice' as const
          }))
        ].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        setTransactions(combined)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (transaction: Transaction) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?")
    if (!confirmDelete) return

    const token = Cookies.get("token")
    try {
      let endpoint = ''
      switch(transaction.transactionType) {
        case 'expense':
          endpoint = `http://localhost:3000/expenses/${transaction.id}`
          break
        case 'sale':
          endpoint = `http://localhost:3000/sales/${transaction.id}`
          break
        case 'invoice':
          endpoint = `http://localhost:3000/sale-digital/${transaction.id}`
          break
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to delete transaction')
      
      setTransactions(prev => prev.filter(t => t.id !== transaction.id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentTransactions = transactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Recurrence</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              currentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="capitalize">
                    {transaction.transactionType}
                  </TableCell>
                  <TableCell>
                    {transaction.transactionType === 'expense' ? transaction.title :
                     transaction.transactionType === 'sale' ? transaction.product.name :
                     transaction.invoice.client.name}
                  </TableCell>
                  <TableCell>
                    {transaction.transactionType === 'expense' ? 
                      (transaction.repeat 
                        ? `${transaction.repeatType}${transaction.endDate ? ` until ${formatDate(transaction.endDate)}` : ''}`
                        : 'One-time') : '—'}
                  </TableCell>
                  <TableCell>
                    {transaction.transactionType === 'expense' ? (
                      <TransactionStatusBadge status={transaction.repeat ? 'recurring' : 'completed'} />
                    ) : transaction.transactionType === 'invoice' ? (
                      <TransactionStatusBadge status={transaction.invoice.status} />
                    ) : '—'}
                  </TableCell>
                  <TableCell className={`text-right ${
                    transaction.transactionType === 'expense' 
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {transaction.transactionType === 'expense' ? '-' : '+'}
                    {formatCurrency(
                      transaction.transactionType === 'expense' ? transaction.amount :
                      transaction.transactionType === 'sale' ? transaction.product.price * transaction.quantity :
                      transaction.invoice.items.reduce((sum, item) => sum + item.amount, 0)
                    )}
                  </TableCell>
                  <TableCell>
                    <TransactionActions
                      transaction={transaction}
                      onDelete={() => handleDelete(transaction)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}