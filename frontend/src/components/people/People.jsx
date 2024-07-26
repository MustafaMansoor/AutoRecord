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
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/companies', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCompanies(data.companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const companyIds = companies.map(company => company._id);
        const peoplePromises = companyIds.map(id =>
          axios.get(`http://localhost:3000/api/companies/${id}/people`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        );
        const responses = await Promise.all(peoplePromises);
        const allPeople = responses.flatMap(response => 
          response.data.people.map(person => ({ ...person, companyId: response.data.companyId }))
        );
        setPeople(allPeople);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    if (companies.length > 0) {
      fetchPeople();
    }
  }, [companies]);

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
            {people.map((person) => (
              <TableRow key={person._id}>
                <TableCell>{person.email}</TableCell>
                <TableCell>{person.username}</TableCell>
                <TableCell>
                  {companies.find(company => company._id === person.companyId)?.companyName || 'N/A'}
                </TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default People;
