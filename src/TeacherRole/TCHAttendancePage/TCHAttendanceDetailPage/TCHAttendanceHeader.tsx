
type Props = {
  groupName: string;
  title: string;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  onDownload: () => void;
  searchPlaceholder: string;
};

export default function AttendanceHeader({
  groupName,
  title,
  searchTerm,
  setSearchTerm,
  showSearch,
  setShowSearch,
  onDownload,
  searchPlaceholder,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => window.history.back()}
          className="w-12 h-12 mx-3 my-3 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
        >
          <i className="fa-solid fa-arrow-left text-black"></i>
        </button>

        {groupName && (
          <h1 className="2xl:text-4xl text-3xl font-bold dark:text-white">
            {groupName} {title}
          </h1>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`p-2 border border-gray-300 rounded transition-all duration-300 ${
                showSearch ? "w-48 opacity-100" : "w-0 opacity-0"
              }`}
              style={{ visibility: showSearch ? "visible" : "hidden" }}
            />
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 px-4 ml-2"
            >
              <i className="fa fa-search"></i>
            </button>
          </div>

          <button
            onClick={onDownload}
            className="text-white bg-green-500 hover:bg-green-600 rounded py-3 px-5 flex items-center gap-2"
          >
            <i className="fa fa-download"></i>
            <span className="hidden sm:inline">Yuklab olish</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4 mt-3 md:hidden px-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`p-2 border border-gray-300 rounded transition-all duration-300 ${
            showSearch ? "w-48 opacity-100" : "w-0 opacity-0"
          }`}
          style={{ visibility: showSearch ? "visible" : "hidden" }}
        />
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="bg-gray-200 hover:bg-gray-300 rounded py-3 px-4 ml-2"
        >
          <i className="fa fa-search"></i>
        </button>
      </div>
    </>
  );
}