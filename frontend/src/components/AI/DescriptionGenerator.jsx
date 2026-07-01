import React, { useState } from 'react';
import API from '../../services/api';
import { Sparkles, Loader2 } from 'lucide-react';

const DescriptionGenerator = ({ title, condition, onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!title || !condition) {
      setError('Enter title and select condition first!');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/generate-description', {
        title,
        condition
      });

      if (data && data.description) {
        onGenerate(data.description);
      }
    } catch (err) {
      console.error('AI Description Generation failed:', err);
      setError('AI service busy. Try writing manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !title || !condition}
        className="btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5 border border-primary-500/10 dark:border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-primary-500 group-hover:scale-110 transition-transform" />
        )}
        Generate AI Description
      </button>
      
      {error && (
        <span className="text-[10px] text-rose-500 font-medium px-1">{error}</span>
      )}
    </div>
  );
};

export default DescriptionGenerator;
