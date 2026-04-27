import Header from '@/components/layout/Header';
import SettingIcon from '@/assets/images/account/settingIcon.svg';
import DefaultProfileIcon from '@assets/images/account/defaultProfileIcon.svg';
import { useState } from 'react';

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('한 줄 소개를 적어 주세요!');
  const [myPromise, setMyPromise] = useState({
    joined: 1,
    created: 1,
  });

  const [userInfo, setUserInfo] = useState({
    name: '지그마',
    email: 'zigma@hansung.ac.kr',
    profileImage: null as string | null,
  });

  return (
    <div className="flex flex-col gap-5">
      <Header title="내 정보" rightIcon={SettingIcon} />
      <div className="px-4">
        <div className="flex flex-col bg-[#E2EAF3] p-4 rounded-2xl gap-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFFFFF] w-12.5 h-12.5 pt-1 rounded-full overflow-hidden">
                {userInfo.profileImage ? (
                  <img
                    src={userInfo.profileImage}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={DefaultProfileIcon} alt="기본 프로필" />
                )}
              </div>
              <div className="flex flex-col gap-px">
                <p className="text-[#000000] font-Pretendard font-semibold text-[1.25rem] leading-7">
                  {userInfo.name || '이름'}
                </p>

                <p className="text-[#888888] font-Pretendard font-regular text-[0.75rem] leading-4.2">
                  {userInfo.email || '이메일'}
                </p>
              </div>
            </div>
            <div
              className="h-5.5 py-0.5 px-3 bg-[#FFFFFF] rounded-[10px] cursor-pointer"
              onClick={() => {
                if (isEditing && bio.trim() === '') return;
                setIsEditing(!isEditing);
              }}
            >
              <p className="text-[#888888] font-Pretendard font-regular text-[0.75rem] leading-4.2">
                {isEditing ? '완료' : '편집'}
              </p>
            </div>
          </div>
          <div className="px-3 py-2 bg-[#FFFFFF] rounded-[10px]">
            {isEditing ? (
              <input
                className="w-full text-[#888888] font-Pretendard font-regular text-[0.75rem] leading-4.2 resize-none outline-none bg-transparent"
                value={bio}
                onChange={e => setBio(e.target.value)}
                autoFocus
              />
            ) : (
              <p className="text-[#888888] font-Pretendard font-regular text-[0.75rem] leading-4.2">
                {bio}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col px-10 h-19 items-center justify-center text-center bg-[#FFFFFF] border border-[#C6C6C6] rounded-[10px]">
              <p className="text-[#000000] font-Pretendard font-light text-[0.75rem] leading-4.2">
                참여 중인 약속
              </p>
              <p className="text-[#000000] font-Pretendard font-semibold text-[1.75rem] leading-10">
                {myPromise.joined}
              </p>
            </div>
            <div className="flex flex-col px-13 h-19 items-center justify-center text-center bg-[#FFFFFF] border border-[#C6C6C6] rounded-[10px]">
              <p className="text-[#000000] font-Pretendard font-light text-[0.75rem] leading-4.2">
                만든 약속
              </p>
              <p className="text-[#000000] font-Pretendard font-semibold text-[1.75rem] leading-10">
                {myPromise.created}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
