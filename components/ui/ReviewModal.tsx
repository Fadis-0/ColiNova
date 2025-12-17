import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from './Button';
import { Star } from 'lucide-react';
import { Modal } from './Modal';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('leaveReview')}>
      <div className="space-y-4">
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-10 h-10 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            {t('comment')}
          </label>
          <textarea
            id="comment"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <Button onClick={handleSubmit} className="w-full" size="lg">
          {t('submitReview')}
        </Button>
      </div>
    </Modal>
  );
};
