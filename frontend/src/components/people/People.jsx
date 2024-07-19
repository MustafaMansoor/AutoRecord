import React, { useState } from 'react';
import CustomButton from "./Button";
import AddIcon from '@mui/icons-material/Add';
import InvitePeople from './InvitePeople';

const People = () => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  const handleOpenInvitePopup = () => {
    setShowInvitePopup(true);
  };

  const handleCloseInvitePopup = () => {
    setShowInvitePopup(false);
  };

  return (
    <div>
      <CustomButton
        icon={<AddIcon />}
        text="Invite People"
        onClick={handleOpenInvitePopup}
      />
      <InvitePeople show={showInvitePopup} handleClose={handleCloseInvitePopup} />
    </div>
  );
};

export default People;
