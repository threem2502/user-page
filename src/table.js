import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from '@fortawesome/free-solid-svg-icons';


const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #D5D6DB;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-family: Arial; 
`

const TableWrapper = styled.div`
  width: 60%;
  height: 75%;
  background-color: #fff;
  border: 1px solid #BFBFBF;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`

const TableHeader = styled.div`
  margin: 0;
  width: 100%;
  height: 50px;
  border-top-radius: 5px;
  border-bottom: 2px solid #BFBFBF;
  display: flex;
  flex-wrap: no-wrap;
  align-items: center;
`

const ColumnName = styled.p`
  color: #1B1B6C;
  margin-left: 5%;
  width: ${props => props.width};
  font-weight: 600;
  cursor: pointer;
`

const TableContent = styled.div` 
  width: 100%;
  height: 90%;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

const Row = styled.div`
  width: 100%;
  height: 50px;
  background-color: ${props => props.id % 2 === 0 ? '#fff' : '#ECECEC'};
  display: flex;
  justify-content: flex-start;
  align-items: center; 
`

const Thumbnail = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50px;
  cursor: pointer;
`
const RowItem = styled.p`
  font-size: 80%;
  color: #47449E;
  margin-left: 5%;
  width: ${props => props.width};
  cursor: pointer;
`

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5%;
  width: 60%;
  height: 5%;
`

const NavButton = styled.button`
  background-color: ${props => props.active ? '#1B1B6C' : '#6E69FD'}; 
  height: 20px;
  font-size: 80%;
  color: white;
  border: none; 
  border-radius: 5px;
  padding: 5px 14px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease; 
  
  &:hover {
    background-color: #1B1B6C;
  }
`



const Table = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`https://randomuser.me/api/?results=100`);
      setUsers(response.data.results);
    };
  
    fetchUsers();
  }, []);
  const [currentUsers, setCurrentUsers] = useState(users.slice(0,10));

  useEffect(() => {
    const indexOfLastUser = currentPage * 10;
    const indexOfFirstUser = indexOfLastUser - 10;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    setCurrentUsers(currentUsers);
  }, [users, currentPage]);

  useEffect(() => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        let valueA = null;
        let valueB = null;
        if (sortConfig.key === 'name') {
          valueA = a.name.title + a.name.first + a.name.last;
          valueB = b.name.title + b.name.first + b.name.last;
        }
        else if (sortConfig.key === 'login.username') {
          valueA = a.login.username;
          valueB = b.login.username;
        }
        if (valueA <= valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setUsers(sortableUsers)
  }, [sortConfig]);

  const handleSort = (key) => {
    if (sortConfig.direction === 'desc') {
      setSortConfig({ key, direction:'asc'});
    }
    else {
      setSortConfig({ key, direction:'desc' });
    }
    console.log(sortConfig);
  };

  return (
    <Wrapper>
      <TableWrapper>
        <TableHeader>
          <ColumnName width='5%'></ColumnName>
          <ColumnName width='20%' onClick={() => handleSort('name')}>
            Full name <FontAwesomeIcon icon={faSort} />
          </ColumnName>
          <ColumnName width='20%' onClick={() => handleSort('login.username')}>
            Username  <FontAwesomeIcon icon={faSort}/>
          </ColumnName>
          <ColumnName width='20%'>Email</ColumnName>
        </TableHeader>
        <TableContent>
          {currentUsers.map((user, index) => (
            <Row id={index} key={index}>
              <RowItem width='5%'><Thumbnail src={user.picture.thumbnail} /></RowItem>
              <RowItem width='20%'>{`${user.name.title} ${user.name.first} ${user.name.last}`}</RowItem>
              <RowItem width='20%'>{user.login.username}</RowItem>
              <RowItem width='20%'>{user.email}</RowItem>
            </Row>
          ))}
        </TableContent>
      </TableWrapper>
      <Navigation>
        {[...Array(10)].map((_, index) => (
          <NavButton
            key={index}
            active={currentPage === index + 1}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </NavButton>
        ))}
      </Navigation>
    </Wrapper>
  );
};

export default Table;