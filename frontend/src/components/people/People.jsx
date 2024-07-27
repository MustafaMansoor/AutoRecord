import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomButton from "./Button";
import AddIcon from '@mui/icons-material/Add';
import InvitePeople from './InvitePeople';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import './People.css';

const People = () => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/companies/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCompanies(data.companies);
        console.log(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        if (error.response && error.response.data.name === 'TokenExpiredError') {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      }
    };

    fetchCompanies();
  }, []);

  const handleOpenInvitePopup = () => {
    setShowInvitePopup(true);
  };

  const handleCloseInvitePopup = () => {
    setShowInvitePopup(false);
  };

  const handleDelete = async (personId) => {
    try {
      // Implement the delete logic here
      console.log(`Delete person with ID: ${personId}`);
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  return (
    <div>
      <CustomButton
        icon={<AddIcon />}
        text="Invite People"
        onClick={handleOpenInvitePopup}
      />
      <InvitePeople show={showInvitePopup} handleClose={handleCloseInvitePopup} />
      <TableContainer component={Paper} className="table-container">
        <Table sx={{ minWidth: 650 }} aria-label="people table">
          <TableHead className="table-head">
            <TableRow>
              <TableCell className="table-cell">Email</TableCell>
              <TableCell className="table-cell">Username</TableCell>
              <TableCell className="table-cell">Company Name</TableCell>
              <TableCell className="table-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.flatMap(company => 
              company.people.map(person => (
                <TableRow key={person._id}>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{person.username}</TableCell>
                  <TableCell>{company.companyName}</TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleDelete(person._id)} 
                      variant="contained" 
                      sx={{
                        backgroundColor: "#FA3F49", 
                        color: "#fff", 
                        textTransform: "none", 
                        "&:hover": { backgroundColor: "#DB3740" }
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default People;