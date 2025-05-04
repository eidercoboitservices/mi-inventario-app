import React from 'react';

const BackupRestoreButtons = () => {
  const handleBackup = () => {
    // @ts-ignore
    window.api.backup();
  };

  const handleRestore = () => {
    // @ts-ignore
    window.api.restore();
  };

  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={handleBackup}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Crear copia de seguridad
      </button>
      <button
        onClick={handleRestore}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      >
        Restaurar respaldo
      </button>
    </div>
  );
};

export default BackupRestoreButtons;
