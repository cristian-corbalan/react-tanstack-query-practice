import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';

export default function DeleteEventButton ({ eventId }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    }
  });

  function handleDelete () {
    mutate({ id: eventId });
  }

  function handleStartDelete () {
    setIsDeleting(true);
  }

  function handleStopDelete () {
    setIsDeleting(false);
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h1>Are you sure?</h1>
          <p>Are you sure to delete this event? This action cannot be undone.</p>
          <div className="form-actions">
            {isPending && <p>Deleting the event...</p>}
            {!isPending && (
              <>
                <button onClick={handleStopDelete} className="button-text">Cancel</button>
                <button onClick={handleDelete} className="button">Delete</button>
              </>
            )}
          </div>
          {isError && <ErrorBlock title="Failed to delete event" message={error.info?.message || 'Failed to delete de event. Try again later.'} /> }
        </Modal>
      )}
      <button onClick={handleStartDelete}>Delete</button>
    </>
  );
}
