import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function DeleteEventButton ({ eventId }) {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    }
  });

  function handleSubmit (event) {
    event.preventDefault();
    mutate({ id: eventId });
  }

  return (
    <form onSubmit={handleSubmit}>
      {isError && <ErrorBlock
        title="Failed to delete event"
        message={error.info?.message || 'Could not delete the event, try again later.'} />}
      <button disabled={isPending}>{isPending ? 'Deleting...' : 'Delete'}</button>
    </form>
  );
}
