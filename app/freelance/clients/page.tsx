"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, DollarSign, Trash2, MoreVertical, Edit, TrendingUp, TrendingDown } from "lucide-react"
import { CreateClientDialog } from "@/components/client/CreateClientDialog"
import { useState, useEffect, useCallback } from "react"
import { EditClientDialog } from "@/components/client/EditClientDialog"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Cookies from 'js-cookie'
import { Receipt } from "lucide-react"

import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface Client {
  id: string
  name: string
  avatar: string
  createdBy: string
  userId?: string
  projects: Array<{ projectId: string }>
  Invoice: Array<{ items: Array<{ amount: number }> }>
  status: string
  lastInteraction: string
}

interface Project {
   id: string
  name: string
}
interface ProjectsMap {
  [key: string]: Project
}
interface User {
  id: string
  fullname: string
  profile_photo?: string
}

const DeleteChoiceDialog = ({ 
  open, 
  onOpenChange, 
  onDelete 
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (deleteInvoices: boolean) => void
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[400px]">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Delete Options</h2>
              <p className="text-muted-foreground">Choose deletion type</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="destructive" onClick={() => onDelete(false)}>
              Delete Client Only
            </Button>
            <Button variant="destructive" onClick={() => onDelete(true)}>
              Delete Client with All Invoices
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export default function ClientHubPage() {
  const [showDialog, setShowDialog] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<ProjectsMap>({})
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [creators, setCreators] = useState<Record<string, User>>({})

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) throw new Error("Failed to fetch user")
        const userData = await response.json()
        setCurrentUserId(userData.sub)
      } catch (err) {
        console.error("Error fetching current user:", err)
      }
    }
    fetchCurrentUser()
  }, [])

  const fetchClients = useCallback(async () => {
  setLoading(true)
  try {
    const token = Cookies.get("token")
    const response = await fetch("http://localhost:3000/client", {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Failed to fetch clients')
    const data = await response.json()

    // Fetch project data for all projects
    const projectIds = Array.from(
      new Set(data.flatMap((client: Client) => client.projects.map(p => p.projectId)))
    )
    
    const projectsResponse = await Promise.all(
      projectIds.map(id => 
        fetch(`http://localhost:3000/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    )
    const projectsData = await Promise.all(projectsResponse.map(res => res.json()))
    const projectsMap = projectsData.reduce((acc: ProjectsMap, project) => ({
      ...acc,
      [project.id]: project
    }), {})
    setProjects(projectsMap)

    // Fetch creator information
    const creatorIds = [...new Set(data.map((client: Client) => client.createdBy))]
    const creatorsResponse = await Promise.all(
      creatorIds.map(id => 
        fetch(`http://localhost:3000/auth/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )
    )
    const creatorsData = await Promise.all(creatorsResponse.map(res => res.json()))
    const creatorsMap = creatorsData.reduce((acc, user) => ({
      ...acc,
      [user.id]: user
    }), {})
    setCreators(creatorsMap)

    setClients(data)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load clients')
  } finally {
    setLoading(false)
  }
}, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      default: return ""
    }
  }

  const handleDeleteClient = async (clientId: string, deleteInvoices: boolean) => {
    try {
      const token = Cookies.get("token")
      const response = await fetch(
        `http://localhost:3000/client/${clientId}?deleteInvoices=${deleteInvoices}`, 
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )
      if (!response.ok) throw new Error('Failed to delete client')
      setClients(prev => prev.filter(client => client.id !== clientId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete client')
    }
  }

  // Client-side filtering
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProject = selectedProjectId 
      ? client.projects.some(p => p.projectId === selectedProjectId)
      : true
    return matchesSearch && matchesProject
  })

  // Calculate income and expenses based on createdBy
  const totalIncome = filteredClients
    .filter(client => client.createdBy === currentUserId) // Current user created = income
    .reduce((sum, client) => 
      client.Invoice.reduce((invoiceSum, invoice) => 
        invoiceSum + invoice.items.reduce((itemSum, item) => itemSum + (item.amount || 0), 0)
      , 0) + sum
    , 0)

  const totalExpenses = filteredClients
    .filter(client => client.createdBy !== currentUserId) // Others created = expense
    .reduce((sum, client) => 
      client.Invoice.reduce((invoiceSum, invoice) => 
        invoiceSum + invoice.items.reduce((itemSum, item) => itemSum + (item.amount || 0), 0)
      , 0) + sum
    , 0)

  const netProfit = totalIncome - totalExpenses

  if (loading) return <div className="container py-8 text-center">Loading clients...</div>
  if (error) return <div className="container py-8 text-center text-destructive">{error}</div>

  return (
    <div className="container py-8 space-y-8">
      {selectedClient && (
        <EditClientDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          client={selectedClient}
          onSuccess={fetchClients}
        />
      )}
      <DeleteChoiceDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={(deleteInvoices) => selectedClient && handleDeleteClient(selectedClient.id, deleteInvoices)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Hub</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
        <CreateClientDialog open={showDialog} onOpenChange={setShowDialog} onSuccess={fetchClients} />
      </div>

      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search clients by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-[400px]"
        />
        
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="p-2 border rounded-lg max-w-[400px]"
        >
          <option value="">All Projects</option>
          {clients
            .flatMap(client => client.projects)
            .filter((v, i, a) => a.findIndex(t => t.projectId === v.projectId) === i)
            .map(project => (
              <option key={project.projectId} value={project.projectId}>
                {project.projectId}
              </option>
            ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredClients.length}</div>
            <p className="text-xs text-muted-foreground">Filtered active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From clients you created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From clients others created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Income - Expenses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredClients.map((client) => {
            const isOwner = client.createdBy === currentUserId
            const creator = creators[client.createdBy]
            const clientAmount = client.Invoice.reduce((sum, invoice) => 
              sum + invoice.items.reduce((itemSum, item) => itemSum + (item.amount || 0), 0)
            , 0)

            return (
              <div key={client.id} className="flex flex-col space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback>{client.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{client.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {creator && (
                          <div className="flex items-center gap-2 mt-1">
                            <span>Created by:</span>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={creator.profile_photo} />
                              <AvatarFallback>{creator.fullname[0]}</AvatarFallback>
                            </Avatar>
                            <span>{creator.fullname}</span>
                            {isOwner && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                                Income
                              </Badge>
                            )}
                            {!isOwner && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-red-100 text-red-800">
                                Expense
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {client.status && (
                      <Badge className={getStatusColor(client.status)}>
                        {client.status.toUpperCase()}
                      </Badge>
                    )}
                    {isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setSelectedClient(client)
                            setShowEditDialog(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedClient(client)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 mt-1">
                    <span>{client.projects.length} projects</span>
                    <span>•</span>
                    <span className={isOwner ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      ${clientAmount.toLocaleString()}
                      {isOwner ? ' (Income)' : ' (Expense)'}
                    </span>
                  </div>
                  {client.userId && (
                    <Button variant="outline">Send Message</Button>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}