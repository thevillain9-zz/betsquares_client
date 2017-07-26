import { IGame } from '../../models/IGame';
import { ITeam } from '../../models/ITeam';
import { IScore } from '../../models/IScore';

export const GAMES_MOCK_DATA: IGame[] = [
  <IGame>{
    'gameId': 1,
    'homeTeam': <ITeam>{
      'teamId': 3,
      'location': 'New York',
      'teamName': 'Giants',
      'shortName': 'NYG',
      'logoUri': 'http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/nyg.png&h=50',
      'teampageUri': 'http://www.espn.com/nfl/team/_/name/nyg/new-york-giants',
    },
    'awayTeam': <ITeam>{
      'teamId': 1,
      'location': 'Dallas',
      'teamName': 'Cowboys',
      'shortName': 'DAL',
      'logoUri': 'http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/dal.png&h=50',
      'teampageUri': 'http://www.espn.com/nfl/team/_/name/dal/dallas-cowboys',
    },
    'gameDate': '2016-10-13T13:30:00.000Z',
    'isActive': false,
    'isFinished': false,
    'gamePeriod': 8,
    'score': <IScore>{
      'gameId': 1,
      'scoreId': 2,
      'homeTeamScore': 30,
      'awayTeamScore': 17,
      'currentPeriod': '4th quarter',
      'currentTime': '8:58',
      'periodNames': [
        '1',
        '2',
        '3',
        '4',
        'T'
      ],
      'awayTeamTotalScores': [
        7,
        14,
        14,
        17
      ],
      'awayTeamPeriodScores': [
        7,
        7,
        0,
        3
      ],
      'homeTeamTotalScores': [
        3,
        6,
        16,
        30
      ],
      'homeTeamPeriodScores': [
        3,
        3,
        10,
        14
      ]
    }
  }
];
