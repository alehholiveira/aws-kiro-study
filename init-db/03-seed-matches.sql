-- Seed data for Historical World Cup Matches
-- Notable matches from FIFA World Cup tournaments 1950-2022

INSERT INTO Matches (year, stage, date, team1, team2, score1, score2) VALUES
-- 1950 World Cup (Brazil)
(1950, 'Final Round', '1950-07-16', 'Uruguay', 'Brazil', 2, 1),
(1950, 'Final Round', '1950-07-13', 'Brazil', 'Spain', 6, 1),
(1950, 'Final Round', '1950-07-09', 'Uruguay', 'Spain', 2, 2),

-- 1954 World Cup (Switzerland)
(1954, 'Final', '1954-07-04', 'West Germany', 'Hungary', 3, 2),
(1954, 'Semi-Final', '1954-06-30', 'West Germany', 'Austria', 6, 1),
(1954, 'Semi-Final', '1954-06-30', 'Hungary', 'Uruguay', 4, 2),
(1954, 'Quarter-Final', '1954-06-27', 'Hungary', 'Brazil', 4, 2),

-- 1958 World Cup (Sweden)
(1958, 'Final', '1958-06-29', 'Brazil', 'Sweden', 5, 2),
(1958, 'Semi-Final', '1958-06-24', 'Brazil', 'France', 5, 2),
(1958, 'Semi-Final', '1958-06-24', 'Sweden', 'West Germany', 3, 1),

-- 1962 World Cup (Chile)
(1962, 'Final', '1962-06-17', 'Brazil', 'Czechoslovakia', 3, 1),
(1962, 'Semi-Final', '1962-06-13', 'Brazil', 'Chile', 4, 2),
(1962, 'Semi-Final', '1962-06-13', 'Czechoslovakia', 'Yugoslavia', 3, 1),

-- 1966 World Cup (England)
(1966, 'Final', '1966-07-30', 'England', 'West Germany', 4, 2),
(1966, 'Semi-Final', '1966-07-26', 'England', 'Portugal', 2, 1),
(1966, 'Semi-Final', '1966-07-25', 'West Germany', 'Soviet Union', 2, 1),
(1966, 'Quarter-Final', '1966-07-23', 'England', 'Argentina', 1, 0),

-- 1970 World Cup (Mexico)
(1970, 'Final', '1970-06-21', 'Brazil', 'Italy', 4, 1),
(1970, 'Semi-Final', '1970-06-17', 'Brazil', 'Uruguay', 3, 1),
(1970, 'Semi-Final', '1970-06-17', 'Italy', 'West Germany', 4, 3),
(1970, 'Quarter-Final', '1970-06-14', 'Brazil', 'Peru', 4, 2),
(1970, 'Quarter-Final', '1970-06-14', 'West Germany', 'England', 3, 2),

-- 1974 World Cup (West Germany)
(1974, 'Final', '1974-07-07', 'West Germany', 'Netherlands', 2, 1),
(1974, 'Semi-Final', '1974-07-03', 'West Germany', 'Poland', 1, 0),
(1974, 'Semi-Final', '1974-07-03', 'Netherlands', 'Brazil', 2, 0),

-- 1978 World Cup (Argentina)
(1978, 'Final', '1978-06-25', 'Argentina', 'Netherlands', 3, 1),
(1978, 'Semi-Final', '1978-06-21', 'Argentina', 'Peru', 6, 0),
(1978, 'Semi-Final', '1978-06-21', 'Netherlands', 'Italy', 2, 1),

-- 1982 World Cup (Spain)
(1982, 'Final', '1982-07-11', 'Italy', 'West Germany', 3, 1),
(1982, 'Semi-Final', '1982-07-08', 'Italy', 'Poland', 2, 0),
(1982, 'Semi-Final', '1982-07-08', 'West Germany', 'France', 3, 3),
(1982, 'Quarter-Final', '1982-07-05', 'France', 'Brazil', 1, 1),

-- 1986 World Cup (Mexico)
(1986, 'Final', '1986-06-29', 'Argentina', 'West Germany', 3, 2),
(1986, 'Semi-Final', '1986-06-25', 'Argentina', 'Belgium', 2, 0),
(1986, 'Semi-Final', '1986-06-25', 'West Germany', 'France', 2, 0),
(1986, 'Quarter-Final', '1986-06-22', 'Argentina', 'England', 2, 1),
(1986, 'Quarter-Final', '1986-06-21', 'France', 'Brazil', 1, 1),

-- 1990 World Cup (Italy)
(1990, 'Final', '1990-07-08', 'West Germany', 'Argentina', 1, 0),
(1990, 'Semi-Final', '1990-07-04', 'West Germany', 'England', 1, 1),
(1990, 'Semi-Final', '1990-07-03', 'Argentina', 'Italy', 1, 1),
(1990, 'Quarter-Final', '1990-07-01', 'West Germany', 'Czechoslovakia', 1, 0),
(1990, 'Quarter-Final', '1990-06-30', 'Argentina', 'Yugoslavia', 0, 0),

-- 1994 World Cup (United States)
(1994, 'Final', '1994-07-17', 'Brazil', 'Italy', 0, 0),
(1994, 'Semi-Final', '1994-07-13', 'Brazil', 'Sweden', 1, 0),
(1994, 'Semi-Final', '1994-07-13', 'Italy', 'Bulgaria', 2, 1),
(1994, 'Quarter-Final', '1994-07-09', 'Brazil', 'Netherlands', 3, 2),
(1994, 'Quarter-Final', '1994-07-09', 'Italy', 'Spain', 2, 1),

-- 1998 World Cup (France)
(1998, 'Final', '1998-07-12', 'France', 'Brazil', 3, 0),
(1998, 'Semi-Final', '1998-07-08', 'France', 'Croatia', 2, 1),
(1998, 'Semi-Final', '1998-07-07', 'Brazil', 'Netherlands', 1, 1),
(1998, 'Quarter-Final', '1998-07-04', 'France', 'Italy', 0, 0),
(1998, 'Quarter-Final', '1998-07-03', 'Brazil', 'Denmark', 3, 2),

-- 2002 World Cup (South Korea and Japan)
(2002, 'Final', '2002-06-30', 'Brazil', 'Germany', 2, 0),
(2002, 'Semi-Final', '2002-06-26', 'Brazil', 'Turkey', 1, 0),
(2002, 'Semi-Final', '2002-06-25', 'Germany', 'South Korea', 1, 0),
(2002, 'Quarter-Final', '2002-06-22', 'Brazil', 'England', 2, 1),
(2002, 'Quarter-Final', '2002-06-21', 'Germany', 'United States', 1, 0),
(2002, 'Quarter-Final', '2002-06-22', 'South Korea', 'Spain', 0, 0),

-- 2006 World Cup (Germany)
(2006, 'Final', '2006-07-09', 'Italy', 'France', 1, 1),
(2006, 'Semi-Final', '2006-07-05', 'Italy', 'Germany', 2, 0),
(2006, 'Semi-Final', '2006-07-04', 'France', 'Portugal', 1, 0),
(2006, 'Quarter-Final', '2006-07-01', 'Germany', 'Argentina', 1, 1),
(2006, 'Quarter-Final', '2006-06-30', 'Italy', 'Ukraine', 3, 0),
(2006, 'Quarter-Final', '2006-07-01', 'France', 'Brazil', 1, 0),

-- 2010 World Cup (South Africa)
(2010, 'Final', '2010-07-11', 'Spain', 'Netherlands', 1, 0),
(2010, 'Semi-Final', '2010-07-07', 'Spain', 'Germany', 1, 0),
(2010, 'Semi-Final', '2010-07-06', 'Netherlands', 'Uruguay', 3, 2),
(2010, 'Quarter-Final', '2010-07-03', 'Netherlands', 'Brazil', 2, 1),
(2010, 'Quarter-Final', '2010-07-02', 'Germany', 'Argentina', 4, 0),
(2010, 'Quarter-Final', '2010-07-03', 'Spain', 'Paraguay', 1, 0),

-- 2014 World Cup (Brazil)
(2014, 'Final', '2014-07-13', 'Germany', 'Argentina', 1, 0),
(2014, 'Semi-Final', '2014-07-09', 'Germany', 'Brazil', 7, 1),
(2014, 'Semi-Final', '2014-07-08', 'Argentina', 'Netherlands', 0, 0),
(2014, 'Quarter-Final', '2014-07-05', 'Brazil', 'Colombia', 2, 1),
(2014, 'Quarter-Final', '2014-07-04', 'Germany', 'France', 1, 0),
(2014, 'Quarter-Final', '2014-07-05', 'Argentina', 'Belgium', 1, 0),
(2014, 'Quarter-Final', '2014-07-04', 'Netherlands', 'Costa Rica', 0, 0),
(2014, 'Round of 16', '2014-06-28', 'Brazil', 'Chile', 1, 1),
(2014, 'Round of 16', '2014-06-30', 'Germany', 'Algeria', 2, 1),

-- 2018 World Cup (Russia)
(2018, 'Final', '2018-07-15', 'France', 'Croatia', 4, 2),
(2018, 'Semi-Final', '2018-07-11', 'France', 'Belgium', 1, 0),
(2018, 'Semi-Final', '2018-07-10', 'Croatia', 'England', 2, 1),
(2018, 'Quarter-Final', '2018-07-07', 'France', 'Uruguay', 2, 0),
(2018, 'Quarter-Final', '2018-07-06', 'Belgium', 'Brazil', 2, 1),
(2018, 'Quarter-Final', '2018-07-07', 'England', 'Sweden', 2, 0),
(2018, 'Quarter-Final', '2018-07-06', 'Croatia', 'Russia', 2, 2),
(2018, 'Round of 16', '2018-06-30', 'France', 'Argentina', 4, 3),
(2018, 'Round of 16', '2018-07-01', 'Brazil', 'Mexico', 2, 0),
(2018, 'Round of 16', '2018-07-03', 'Belgium', 'Japan', 3, 2),

-- 2022 World Cup (Qatar)
(2022, 'Final', '2022-12-18', 'Argentina', 'France', 3, 3),
(2022, 'Semi-Final', '2022-12-14', 'Argentina', 'Croatia', 3, 0),
(2022, 'Semi-Final', '2022-12-13', 'France', 'Morocco', 2, 0),
(2022, 'Quarter-Final', '2022-12-10', 'Argentina', 'Netherlands', 2, 2),
(2022, 'Quarter-Final', '2022-12-09', 'France', 'England', 2, 1),
(2022, 'Quarter-Final', '2022-12-10', 'Croatia', 'Brazil', 1, 1),
(2022, 'Quarter-Final', '2022-12-09', 'Morocco', 'Portugal', 1, 0),
(2022, 'Round of 16', '2022-12-05', 'Argentina', 'Australia', 2, 1),
(2022, 'Round of 16', '2022-12-04', 'France', 'Poland', 3, 1),
(2022, 'Round of 16', '2022-12-06', 'England', 'Senegal', 3, 0),
(2022, 'Round of 16', '2022-12-05', 'Netherlands', 'United States', 3, 1),
(2022, 'Round of 16', '2022-12-06', 'Brazil', 'South Korea', 4, 1),
(2022, 'Round of 16', '2022-12-03', 'Croatia', 'Japan', 1, 1);
