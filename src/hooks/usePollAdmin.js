import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../components/helpers';
import moment from 'moment';

export const usePollAdmin = (pollId, oid) => {
  // Existing state
  const [loading, setLoading] = useState(true);
  const [currentPollData, setCurrentPollData] = useState({});
  const [updatedPollData, setUpdatedPollData] = useState({});
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const [showNotOwnerMessage, setShowNotOwnerMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [dateErrorText, setDateErrorText] = useState('');
  const [showGetDate, setShowGetDate] = useState(false);
  const [closingDate, setClosingDate] = useState(null);
  const [candList, setCandList] = useState([]);
  const [submittedRankingInfo, setSubmittedRankingInfo] = useState({
    num_voters: 0,
    num_empty_ballots: 0,
    unranked_candidates: [],
    csv_data: null
  });
  const [columns, setColumns] = useState([]);
  const [numRows, setNumRows] = useState(0);
  const [cmap, setCmap] = useState({});
  const [loadingRankings, setLoadingRankings] = useState(false);

  // Fetch poll data with voter information
  const fetchPollData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/polls/data/${pollId}?oid=${oid}`);
      
      if (response.status === 404) {
        setShowNotFoundMessage(true);
        setLoading(false);
        return;
      }
      
      if (response.status === 403) {
        setShowNotOwnerMessage(true);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch poll data');
      }
      
      const data = await response.json();
      
      if (data.is_owner === false) {
        setShowNotOwnerMessage(true);
        setLoading(false);
        return;
      }

      // Ensure we have all the data we need
      const pollDataWithVoters = {
        ...data,
        voter_details: data.voter_details || [],
        voter_emails: data.voter_emails || []
      };
      
      setCurrentPollData(pollDataWithVoters);
      setUpdatedPollData(pollDataWithVoters);
      setCandList(pollDataWithVoters.candidates || []);
      
      if (data.closing_datetime) {
        // Convert string to moment object
        setClosingDate(moment(data.closing_datetime));
        setShowGetDate(true);
      } else {
        setClosingDate(null);
        setShowGetDate(false);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching poll data:', error);
      setShowErrorMessage(true);
      setErrorMessage('Failed to load poll data');
      setLoading(false);
    }
  }, [pollId, oid]);

  // Initial load
  useEffect(() => {
    fetchPollData();
  }, [fetchPollData]);

  // Refresh poll data
  const refreshPollData = async () => {
    await fetchPollData();
  };

  // Update poll field
  const updatePollField = (field, value) => {
    setUpdatedPollData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update poll
  const updatePoll = async (pollData) => {
    try {
      const response = await fetch(`${API_URL}/polls/update/${pollId}?oid=${oid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });

      if (!response.ok) {
        throw new Error('Failed to update poll');
      }

      setShowMessage(true);
      setMessage('Poll updated successfully');
      await refreshPollData();
      return { success: true };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to update poll');
      return { success: false };
    }
  };

  // Close poll
  const closePoll = async () => {
    try {
      // Update poll with is_completed = true
      const response = await fetch(`${API_URL}/polls/update/${pollId}?oid=${oid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to close poll');
      }

      setShowMessage(true);
      setMessage('Poll closed successfully');
      await refreshPollData();
      return { success: true };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to close poll');
      return { success: false };
    }
  };

  // Open poll
  const openPoll = async () => {
    try {
      // Update poll with is_completed = false
      const response = await fetch(`${API_URL}/polls/update/${pollId}?oid=${oid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_completed: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to open poll');
      }

      setShowMessage(true);
      setMessage('Poll opened successfully');
      await refreshPollData();
      return { success: true };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to open poll');
      return { success: false };
    }
  };

const deleteAllBallots = async () => {
    try {
      const response = await fetch(`${API_URL}/polls/ballots/${pollId}/all?oid=${oid}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage(data.success);
        setShowMessage(true);
        await refreshPollData();
        return { success: true };
      } else {
        setErrorMessage(data.detail || data.error || "Failed to delete ballots");
        setShowErrorMessage(true);
        return { success: false };
      }
    } catch (error) {
      setErrorMessage("Error deleting ballots");
      setShowErrorMessage(true);
      return { success: false };
    }
  };

  // Delete poll
  const deletePoll = async () => {
    try {
      const response = await fetch(`${API_URL}/polls/delete/${pollId}?oid=${oid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete poll');
      }

      return { success: true };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to delete poll');
      return { success: false };
    }
  };

  const resendEmail = async (email) => {
    try {
      const response = await fetch(`${API_URL}/polls/voters/${pollId}/resend?oid=${oid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend email');
      }

      const result = await response.json();
      setShowMessage(true);
      setMessage(result.success || `Email resent to ${email}`);
      await refreshPollData();
      return { success: true, data: result };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to resend email');
      return { success: false };
    }
  };

  // Add voters - using the update endpoint with new_voter_emails
  const addVoters = async (emails) => {
    try {
      const response = await fetch(`${API_URL}/polls/update/${pollId}?oid=${oid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_voter_emails: emails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add voters');
      }

      const result = await response.json();
      setShowMessage(true);
      setMessage(`Successfully added ${emails.length} voter(s)`);
      await refreshPollData();
      return { success: true, data: result };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to add voters');
      return { success: false };
    }
  };

  // Delete voter
  const deleteVoter = async (email) => {
    // Find the voter_id for this email
    const voter = getExistingVoters().find(v => v.email === email);
    if (!voter || !voter.voter_id) {
      setShowErrorMessage(true);
      setErrorMessage('Voter not found');
      return { success: false };
    }
    
    try {
      const response = await fetch(`${API_URL}/polls/voters/${pollId}/${voter.voter_id}?oid=${oid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete voter');
      }

      setShowMessage(true);
      setMessage(`Voter ${email} has been removed`);
      await refreshPollData();
      return { success: true };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to remove voter');
      return { success: false };
    }
  };

  // Generate new vote link for a voter
  const generateNewVoteLink = async (email) => {
    // Find the voter_id for this email
    const voter = getExistingVoters().find(v => v.email === email);
    if (!voter || !voter.voter_id) {
      setShowErrorMessage(true);
      setErrorMessage('Voter not found');
      return { success: false };
    }
    
    try {
      const response = await fetch(`${API_URL}/polls/voters/${pollId}/${voter.voter_id}/regenerate?oid=${oid}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate new link');
      }

      const result = await response.json();
      setShowMessage(true);
      setMessage(`New vote link generated for ${email}`);
      await refreshPollData();
      return { success: true, data: result };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to generate new vote link');
      return { success: false };
    }
  };

  // Get existing voters with vote links
  const getExistingVoters = () => {
    if (!currentPollData || Object.keys(currentPollData).length === 0) {
      return [];
    }

    // Use voter_details if available (should be populated by backend now)
    if (currentPollData.voter_details && Array.isArray(currentPollData.voter_details)) {
      return currentPollData.voter_details;
    }

    return [];
  };

  // Add bulk rankings
  const addBulkRankings = async (file, overwrite) => {
    try {
      const formData = new FormData();
      formData.append('csv_file', file);  // Note: backend expects 'csv_file'
      // Note: overwrite is sent as query param, not form data

      const response = await fetch(`${API_URL}/polls/bulk_vote/${pollId}?oid=${oid}&overwrite=${overwrite}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload rankings');
      }

      const result = await response.json();
      setShowMessage(true);
      setMessage('Rankings uploaded successfully');
      await refreshPollData();
      return { success: true, data: result };
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to upload rankings');
      return { success: false };
    }
  };

  // Get submitted ranking info
  const getSubmittedRankingInfo = async () => {
    setLoadingRankings(true);
    try {
      const response = await fetch(`${API_URL}/polls/submitted_rankings/${pollId}?oid=${oid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch rankings');
      }

      const data = await response.json();
      setSubmittedRankingInfo(data || {
        num_voters: 0,
        num_empty_ballots: 0,
        unranked_candidates: [],
        csv_data: null
      });
      setColumns(data.columns || []);
      setNumRows(data.num_rows || 0);
      setCmap(data.cmap || {});
      setLoadingRankings(false);
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage('Failed to load rankings');
      setLoadingRankings(false);
    }
  };

  return {
    // State
    loading,
    currentPollData,
    updatedPollData,
    showNotFoundMessage,
    showNotOwnerMessage,
    showErrorMessage,
    errorMessage,
    showMessage,
    message,
    dateErrorText,
    showGetDate,
    closingDate,
    candList,
    submittedRankingInfo,
    columns,
    numRows,
    cmap,
    loadingRankings,
    
    // Methods
    updatePollField,
    updatePoll,
    closePoll,
    openPoll,
    deletePoll,
    deleteAllBallots,
    addVoters,
    deleteVoter,
    resendEmail,
    generateNewVoteLink,
    getExistingVoters,
    addBulkRankings,
    getSubmittedRankingInfo,
    refreshPollData,
    
    // Setters
    setShowErrorMessage,
    setShowMessage,
    setMessage,
    setErrorMessage,
    setDateErrorText,
    setClosingDate,
    setShowGetDate,
    setCandList,
  };
};