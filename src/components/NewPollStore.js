
import { hookstate, useHookstate } from '@hookstate/core';

export const newPollState = hookstate({
    id: null,
    owner_id: null,
    submitted: false,
    title: "",
    description: "",
    hide_description:true,
    candidates: [],
    is_private: false,
    closing_datetime: null,
    voter_emails: [],
    show_rankings: true,
    allow_multiple_votes: false,
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
        hide_description:true,
        candidates: [],
        is_private: false,
        closing_datetime: null,
        voter_emails: [],
        show_rankings: true,
        allow_multiple_votes: false,
        can_view_outcome_before_closing: false,
        show_outcome: true,
    });
};
  
export const useNewPollState = () => {
    return useHookstate(newPollState);
};
