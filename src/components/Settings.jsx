import React, { useState, useEffect } from 'react'
import { useTranslation } from '../hooks/useTranslation'

const Settings = ({ isOpen, settings, onUpdateSettings, onClose }) => {
  const [tempSettings, setTempSettings] = useState(settings)
  const { t } = useTranslation(settings.language)
  
  useEffect(() => {
    setTempSettings(settings)
  }, [settings])

  const handleChange = (key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    onUpdateSettings(tempSettings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 w-full sm:rounded-lg shadow-xl sm:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('settings.title')}
          </h3>
          <button
            onClick={onClose}
            className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('settings.theme')}
            </label>
            <select
              value={tempSettings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="light">{t('settings.themes.light')}</option>
              <option value="dark">{t('settings.themes.dark')}</option>
              <option value="system">{t('settings.themes.system')}</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('settings.language')}
            </label>
            <select
              value={tempSettings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="id">{t('settings.languages.id')}</option>
              <option value="en">{t('settings.languages.en')}</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('settings.fontSize')}
            </label>
            <select
              value={tempSettings.fontSize}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="small">{t('settings.fontSizes.small')}</option>
              <option value="medium">{t('settings.fontSizes.medium')}</option>
              <option value="large">{t('settings.fontSizes.large')}</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSave}
            className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t('settings.done')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
