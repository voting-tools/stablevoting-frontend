import { isValidEmail } from "../components/helpers";

export const isEmpty = (s) => s !== undefined && s.replace(/\s/g, "") === "";

export const canUpdatePoll = (pollData, candidates) => {
  const nonNullCands = candidates.filter((c) => !isEmpty(c));
  return (
    pollData !== null &&
    !isEmpty(pollData["title"]) &&
    nonNullCands.length >= 2
  );
};

export const parseEmailList = (emailListStr) => {
  const emails = emailListStr
    .split(" ")
    .join(",")
    .split("\n")
    .join(",")
    .split(",")
    .filter(String);
    
  const validEmails = [];
  const invalidEmails = [];
  
  for (const email of emails) {
    if (isValidEmail(email)) {
      validEmails.push(email);
    } else {
      invalidEmails.push(email);
    }
  }
  
  return { validEmails, invalidEmails };
};

export const candListToRankedStr = (candArr) => {
  if (candArr.length === 0) {
    return "";
  }
  if (candArr.length === 1) {
    return `The candidate ${candArr[0]} has not been ranked by any voters.`;
  } else if (candArr.length === 2) {
    return `The candidates ${candArr[0]} and ${candArr[1]} have not been ranked by any voters.`;
  } else {
    const lastCand = candArr[candArr.length - 1];
    return `The candidates ${candArr.slice(0, -1).join(", ")}, and ${lastCand} have not been ranked by any voters.`;
  }
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};