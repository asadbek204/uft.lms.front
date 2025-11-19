import { Button } from "antd";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  fullName?: string;
  subtitle: string;
  role: string;
  id: string | number;
  t: any;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

const AttachContractHeader = ({
  fullName,
  subtitle,
  role,
  id,
  t,
  onSave,
  onDelete,
}: HeaderProps) => {
  const navigate = useNavigate();
  

  return (
    <div className="px-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            size="large"
            icon={<i className="fa-solid fa-arrow-left" />}
          >
            {t.back}
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {fullName || "Talaba"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-wrap gap-3">
          {(role === "admin" || role === "manager") && (
            <Button
              type="primary"
              size="large"
              style={{ background: "#16a34a" }}
              onClick={() => navigate(`/student/${id}/attach-contract`)}
            >
              <i className="fa-solid fa-plus mr-2" />
              {t.new_contract}
            </Button>
          )}

          <Button type="primary" size="large" onClick={onSave}>
            {t.save}
          </Button>


          {(role === "admin" || role === "manager") && (
            <Button danger size="large" onClick={onDelete}>
              {t.delete}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachContractHeader;
