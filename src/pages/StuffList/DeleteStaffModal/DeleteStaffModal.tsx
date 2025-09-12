interface DeleteStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteStaffModal: React.FC<DeleteStaffModalProps> = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p>Are you sure you want to delete this staff member?</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded mr-2">
                        Cancel
                    </button>
                    <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteStaffModal;
