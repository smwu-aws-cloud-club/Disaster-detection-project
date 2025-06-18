import { getAccessToken } from './auth';
import { CCTVItem } from '../types/database';

export interface LocationOption {
  city: string;
  districts: string[];
}

// Sample data for testing
const sampleLocations: LocationOption[] = [
  {
    city: "강원특별자치도",
    districts: ["원주시", "홍천군", "춘천시", "횡성군", "강릉시", "평창군", "양양군", "인제군", "영월군", "동해시", "삼척시"]
  },
  {
    city: "경기도",
    districts: ["평택시", "의왕시", "군포시", "시흥시", "광명시", "안양시 만안구", "안산시 단원구", "안산시 상록구", "수원시 장안구", "부천시 오정구", "김포시", "고양시 덕양구", "화성시", "부천시 원미구", "오산시", "안양시 동안구", "양주시", "수원시 권선구", "고양시 일산동구", "파주시", "안성시", "성남시 수정구", "성남시 중원구", "하남시", "구리시", "남양주시", "성남시 분당구", "이천시", "광주시", "수원시 영통구", "용인시 기흥구", "용인시 수지구", "용인시 처인구", "여주시", "가평군", "양평군", "포천시", "의정부시"]
  },
  {
    city: "경상남도",
    districts: ["하동군", "산청군", "함양군", "거창군", "사천시", "진주시", "통영시", "고성군", "합천군", "함안군", "김해시", "창원시 마산회원구", "밀양시", "창녕군", "창원시 의창구", "창원시 진해구", "양산시"]
  },
  {
    city: "경상북도",
    districts: ["상주시", "영천시", "경산시", "고령군", "성주군", "칠곡군", "청도군", "구미시", "김천시", "의성군", "안동시", "문경시", "예천군", "영주시", "청송군", "경주시", "포항시 남구", "영덕군", "포항시 북구"]
  },
  {
    city: "광주광역시",
    districts: ["광산구", "북구"]
  },
  {
    city: "대구광역시",
    districts: ["동구", "서구", "달성군", "달서구", "북구", "수성구", "군위군"]
  },
  {
    city: "대전광역시",
    districts: ["대덕구", "서구", "동구", "유성구", "중구"]
  },
  {
    city: "부산광역시",
    districts: ["사상구", "강서구", "북구", "금정구", "기장군", "해운대구"]
  },
  {
    city: "서울특별시",
    districts: ["금천구", "강서구", "양천구", "송파구", "강동구", "서초구", "중랑구", "노원구", "강남구"]
  },
  {
    city: "울산광역시",
    districts: ["울주군", "중구"]
  },
  {
    city: "인천광역시",
    districts: ["남동구", "미추홀구", "부평구", "계양구", "중구", "서구", "연수구"]
  },
  {
    city: "전라남도",
    districts: ["무안군", "장흥군", "강진군", "영암군", "함평군", "영광군", "담양군", "장성군", "나주시", "순천시", "광양시", "보성군", "고흥군", "곡성군", "구례군"]
  },
  {
    city: "전북특별자치도",
    districts: ["고창군", "김제시", "정읍시", "군산시", "부안군", "임실군", "완주군", "익산시", "진안군", "남원시", "순창군", "장수군", "무주군", "전주시 덕진구", "전주시 완산구"]
  },
  {
    city: "충청남도",
    districts: ["예산군", "공주시", "서천군", "부여군", "청양군", "보령시", "홍성군", "당진시", "서산시", "아산시", "천안시 서북구", "천안시 동남구", "논산시", "금산군", "계룡시"]
  },
  {
    city: "충청북도",
    districts: ["청주시 흥덕구", "옥천군", "청주시 서원구", "괴산군", "진천군", "보은군", "영동군", "충주시", "청주시 상당구", "청주시 청원구", "음성군", "단양군", "제천시"]
  }
];

export const getLocations = async (): Promise<LocationOption[]> => {
  // For testing, return sample data
  return sampleLocations;

  // Comment out the actual API call for now
  /*
  try {
    const response = await fetch('/api/cctvs', {
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch locations');
    }

    const cctvItems: CCTVItem[] = await response.json();
    
    // Create unique city-district combinations
    const cityMap = new Map<string, Set<string>>();
    
    cctvItems.forEach(item => {
      if (!cityMap.has(item.city)) {
        cityMap.set(item.city, new Set());
      }
      cityMap.get(item.city)?.add(item.district);
    });
    
    return Array.from(cityMap.entries()).map(([city, districts]) => ({
      city,
      districts: Array.from(districts)
    }));
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
  */
}; 