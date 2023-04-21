
import { createState, useState } from '@hookstate/core';

export const newPollState = createState({
    id: null,
    owner_id: null,
    submitted: false,
    title: "",
    description: "",
    candidates: [],
    is_private: false,
    closing_datetime: null,
    voter_emails: [],
    show_rankings: true,
    can_view_outcome_before_closing: false,
    show_outcome: true,
  });
console.log(newPollState.get())
export const resetPoll = () => {
    newPollState.set({
        id: null,
        owner_id: null,
        submitted: false,
        title: "",
        description: "",
        candidates: [],
        is_private: false,
        closing_datetime: null,
        voter_emails: [],
        show_rankings: true,
        can_view_outcome_before_closing: false,
        show_outcome: true,
        });
};
  
export const useNewPollState = () => {
    return useState(newPollState);
};
  