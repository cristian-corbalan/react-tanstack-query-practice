import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchEvent, updateEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';

export default function EditEvent () {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['event', `event-${id}`],
    queryFn: ({ signal }) => fetchEvent({ id, signal })
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent
  });

  function handleSubmit (formData) {
    mutate({ id, event: formData });
    navigate('../');
  }

  function handleClose () {
    navigate('../');
  }

  let content;

  if (isPending) {
    content = <div className="center"><LoadingIndicator /></div>;
  }

  if (isError) {
    content = <ErrorBlock
      title="Failed to fetch event data"
      message={error.info?.message || 'Failed fetch event information, try again later'} />;
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }
  return (
    <Modal onClose={handleClose}>{content}</Modal>
  );
}
