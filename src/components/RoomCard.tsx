import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { Room } from '@/types'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleManage = () => {
    navigate(`/admin/${room.id}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(navigator.language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleManage}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1">{room.roomName}</CardTitle>
            <CardDescription>
              {t('myRooms.code')}: <span className="font-mono font-semibold">{room.id}</span>
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={handleManage} className="ml-2">
            {t('myRooms.manage')}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('myRooms.created')}: {formatDate(room.createdAt)}
        </div>
      </CardContent>
    </Card>
  )
}
