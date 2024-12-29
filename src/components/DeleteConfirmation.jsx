import React from 'react'
import { useTranslation } from '../hooks/useTranslation'

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, settings }) => {
  const { t } = useTranslation(settings?.language)
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('deleteConfirmation.title')}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('deleteConfirmation.message')}
          </p>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {t('deleteConfirmation.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 dark:hover:bg-red-500"
          >
            {t('deleteConfirmation.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmation
