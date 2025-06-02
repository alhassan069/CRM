import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Edit2, Save, X, Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import axiosInstance from '../api'

const Profile = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    try {
      await updateUser(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      avatar: user?.avatar || ''
    })
    setIsEditing(false)
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U'
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback className="text-lg font-semibold">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{formData.name || 'Your Name'}</div>
              <div className="text-sm text-muted-foreground">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm">{formData.name || 'Not provided'}</span>
                  </div>
                )}
              </div>
              {/* email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formData.email || 'Not provided'}</span>
                  </div>
                )}
              </div>
              {/* phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formData.phone || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* location */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formData.location || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div>
                  <Label htmlFor="avatar" className="text-sm font-medium">
                    Avatar URL
                  </Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    className="mt-1"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="mt-1"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div className="mt-1 text-sm text-muted-foreground">
                {formData.bio || 'No bio provided'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile