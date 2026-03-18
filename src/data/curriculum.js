export const categories = [
  {
    id: 'saving',
    name: '절약/저축',
    emoji: '💰',
    color: '#00ff88',
    concepts: [
      { id: 's1', name: '가계부 작성법', level: 1, summary: '수입과 지출을 기록하는 기본 재테크' },
      { id: 's2', name: '비상금 설계', level: 1, summary: '생활비 3~6개월치 비상금 만들기' },
      { id: 's3', name: '예금 vs 적금', level: 1, summary: '목돈 굴리기와 돈 모으기의 차이' },
      { id: 's4', name: '복리의 마법', level: 2, summary: '이자에 이자가 붙는 복리 효과' },
      { id: 's5', name: 'CMA 통장', level: 2, summary: '수시입출금하면서 이자도 받는 통장' },
      { id: 's6', name: '신용점수 관리', level: 2, summary: '신용점수를 올리는 실전 방법' },
      { id: 's7', name: '신용카드 활용법', level: 2, summary: '혜택은 챙기고 빚은 피하는 법' },
      { id: 's8', name: '인플레이션 대응', level: 3, summary: '물가 상승에 자산을 지키는 방법' },
      { id: 's9', name: '금리와 내 저축', level: 3, summary: '금리 변화가 예적금에 미치는 영향' },
      { id: 's10', name: '저축에서 투자로', level: 3, summary: '안전한 저축을 넘어 투자 시작하기' },
    ]
  },
  {
    id: 'investing',
    name: '주식/투자',
    emoji: '📈',
    color: '#7c3aed',
    concepts: [
      { id: 'i1', name: '주식이란?', level: 1, summary: '주식의 기본 개념과 작동 원리' },
      { id: 'i2', name: 'ETF 투자', level: 1, summary: '여러 주식을 한 번에 사는 ETF' },
      { id: 'i3', name: '배당주 투자', level: 1, summary: '정기적으로 배당금 받는 투자법' },
      { id: 'i4', name: 'PER/PBR 읽기', level: 2, summary: '기업 가치를 평가하는 기본 지표' },
      { id: 'i5', name: '분산투자 원칙', level: 2, summary: '달걀을 한 바구니에 담지 마라' },
      { id: 'i6', name: '분할매수 전략', level: 2, summary: '한 번에 사지 않고 나눠서 사기' },
      { id: 'i7', name: '재무제표 보기', level: 2, summary: '기업의 건강 상태를 읽는 법' },
      { id: 'i8', name: 'MDD 관리', level: 3, summary: '최대 낙폭을 이해하고 리스크 관리' },
      { id: 'i9', name: '레버리지/인버스', level: 3, summary: '고위험 ETF의 작동 원리와 주의점' },
      { id: 'i10', name: '포트폴리오 리밸런싱', level: 3, summary: '자산 비중을 주기적으로 재조정하기' },
    ]
  },
  {
    id: 'realestate',
    name: '부동산',
    emoji: '🏠',
    color: '#f59e0b',
    concepts: [
      { id: 'r1', name: '전세 vs 월세', level: 1, summary: '전세와 월세의 장단점 비교' },
      { id: 'r2', name: '청약 기초', level: 1, summary: '아파트 청약 제도의 기본 이해' },
      { id: 'r3', name: '등기부등본 읽기', level: 1, summary: '집 계약 전 필수 서류 확인법' },
      { id: 'r4', name: '부동산 대출', level: 2, summary: 'LTV/DTI/DSR 대출 규제 이해' },
      { id: 'r5', name: '전세 사기 예방', level: 2, summary: '전세 계약 시 주의해야 할 것들' },
      { id: 'r6', name: '임대차 3법', level: 2, summary: '계약갱신청구권과 전월세 상한제' },
      { id: 'r7', name: '부동산 세금', level: 2, summary: '취득세/보유세/양도세 한눈에 보기' },
      { id: 'r8', name: '갭투자 원리', level: 3, summary: '전세를 이용한 갭투자의 구조와 위험' },
      { id: 'r9', name: '리츠(REITs) 투자', level: 3, summary: '소액으로 부동산에 투자하는 방법' },
      { id: 'r10', name: '부동산 시장 사이클', level: 3, summary: '부동산 가격의 상승과 하락 패턴' },
    ]
  },
  {
    id: 'tax',
    name: '세금/연금',
    emoji: '🧾',
    color: '#ef4444',
    concepts: [
      { id: 't1', name: '소득세 기초', level: 1, summary: '월급에서 세금이 빠지는 구조' },
      { id: 't2', name: '연말정산', level: 1, summary: '13월의 월급을 만드는 방법' },
      { id: 't3', name: '국민연금', level: 1, summary: '국민연금의 구조와 내 수령액 예측' },
      { id: 't4', name: '연금저축/IRP', level: 2, summary: '세액공제 받으면서 노후 준비하기' },
      { id: 't5', name: 'ISA 계좌', level: 2, summary: '세금 혜택 있는 만능 통장' },
      { id: 't6', name: '건강보험료 절약', level: 2, summary: '직장인/프리랜서 건강보험료 관리' },
      { id: 't7', name: '프리랜서 세금', level: 2, summary: '사업소득세와 종합소득세 신고' },
      { id: 't8', name: '금융소득종합과세', level: 3, summary: '이자/배당이 2천만원 넘으면?' },
      { id: 't9', name: '상속/증여세', level: 3, summary: '부의 이전에 따른 세금 이해' },
      { id: 't10', name: '절세 포트폴리오', level: 3, summary: 'ISA+연금저축+IRP 조합 전략' },
    ]
  },
  {
    id: 'macro',
    name: '경제/거시',
    emoji: '🌍',
    color: '#06b6d4',
    concepts: [
      { id: 'm1', name: '기준금리란?', level: 1, summary: '중앙은행이 금리를 결정하는 이유' },
      { id: 'm2', name: '인플레이션', level: 1, summary: '물가가 오르는 이유와 영향' },
      { id: 'm3', name: '환율 기초', level: 1, summary: '달러와 원화의 교환 비율 이해' },
      { id: 'm4', name: 'FOMC와 주식시장', level: 2, summary: '미국 금리 결정이 한국 주식에 미치는 영향' },
      { id: 'm5', name: 'CPI 물가지수', level: 2, summary: '소비자물가지수로 경제 읽기' },
      { id: 'm6', name: '국채금리와 주식', level: 2, summary: '채권 금리가 오르면 주식이 내리는 이유' },
      { id: 'm7', name: '양적완화/긴축', level: 2, summary: '돈을 풀고 조이는 중앙은행의 정책' },
      { id: 'm8', name: '경기 사이클', level: 3, summary: '경기 확장과 수축의 반복 패턴' },
      { id: 'm9', name: '섹터 로테이션', level: 3, summary: '경기 국면별 유망 업종 전략' },
      { id: 'm10', name: '달러 기축통화', level: 3, summary: '왜 전 세계가 달러를 쓰는가' },
    ]
  }
];

export const getAllConcepts = () => categories.flatMap(c => c.concepts);
export const getTotalConcepts = () => getAllConcepts().length;
