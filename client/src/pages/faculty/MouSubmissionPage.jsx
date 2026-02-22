import { useNavigate } from 'react-router-dom';
import api from '../../hooks/useApi';
import MouForm from '../../components/mou/MouForm';
import toast from 'react-hot-toast';

export default function MouSubmissionPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await api.post('/mous', formData);
    toast.success('MoU submitted successfully!');
    navigate('/faculty/mous');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-black mb-6">Submit New MoU</h1>
      <div className="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_black] p-6">
        <MouForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
