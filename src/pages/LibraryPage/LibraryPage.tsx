import { Langs } from "../../enums";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../App";
import Modal from "../LibraryPage/Modal/Modal";
import client from "../../components/services";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type TBooks = {
  id: number;
  name: string;
  image: string;
  author: string;
  description: string;
  count: number;
  year: number;
  language: string;
  category: string;
  downloadUrl: string;
};

type TLibraryComponentContent = {
  title: string;
  button: string;
  categories: string;
};

const contentsMap = new Map<Langs, TLibraryComponentContent>([
  [
    Langs.UZ,
    {
      title: "Kitoblar",
      button: "Kitobni yuklash",
      categories: "Barcha kategoriyalar",
    },
  ],
  [
    Langs.RU,
    {
      title: "Книги",
      button: "СКАЧАТЬ КНИГУ",
      categories: "Все категории",
    },
  ],
  [
    Langs.EN,
    {
      title: "Books",
      button: "Download book",
      categories: "All categories",
    },
  ],
]);

function LibraryPage() {
  const { role, lang } = useContext(GlobalContext);
  const contents = contentsMap.get(lang) as TLibraryComponentContent;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [books, setBooks] = useState<TBooks[]>([]);
  const [sortCategory, setSortCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = (id: number) => {
    setBookToDelete(id);
    setModalVisible(true);
  };

  // Kitoblarni kategoriya bo'yicha saralash
  const sortBooksByCategory = (booksList: TBooks[], category: string) => {
    const filtered = category
      ? booksList.filter((book) => book.category === category)
      : booksList;

    const sorted = [...filtered].sort((a, b) =>
      a.category.localeCompare(b.category)
    );

    setBooks(sorted);
  };

  // Kitoblarni yuklash
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await client.get("books/");
        if (Array.isArray(response.data)) {
          const data: TBooks[] = response.data.map((book) => ({
            id: book.id,
            name: book.name,
            image: book.image,
            author: book.author,
            description: book.description,
            count: 0,
            year: book.year,
            language: book.language,
            category: book.category,
            downloadUrl: book.file?.file || book.file || "", // Xavfsiz olish
          }));
          
          const uniqueCategories = Array.from(
            new Set(data.map((book) => book.category))
          );
          setCategories(uniqueCategories);
          setBooks(data); // Boshlang'ich holatda barcha kitoblarni ko'rsatish
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };
    fetchBooks();
  }, []); // Faqat bir marta ishga tushadi

  // Kategoriya o'zgarganda saralash
  useEffect(() => {
    if (books.length > 0) {
      sortBooksByCategory(books, sortCategory);
    }
  }, [sortCategory]);

  // Yangi kitob qo'shilganda
  const handleUpdate = (newItem: any) => {
    const mappedNew: TBooks = {
      id: newItem.id,
      name: newItem.name,
      image: newItem.image,
      author: newItem.author,
      description: newItem.description,
      count: 0,
      year: newItem.year,
      language: newItem.language,
      category: newItem.category,
      downloadUrl: newItem.downloadUrl || newItem.file?.file || newItem.file || "",
    };

    setBooks((prevBooks) => {
      const updatedBooks = [mappedNew, ...prevBooks];
      
      // Kategoriyalarni yangilash
      const uniqueCategories = Array.from(
        new Set(updatedBooks.map((book) => book.category))
      );
      setCategories(uniqueCategories);
      
      return updatedBooks;
    });
  };

  // Kitobni o'chirish
  const handleDelete = (id: number) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  return (
    <div className="w-full mt-12 md:mt-0">
      <div className="header w-full flex justify-end">
        <div className="m-5 flex w-full justify-between items-center">
          <div></div>
          <h1 className="text-2xl lg:text-4xl font-bold dark:text-customText">
            {contents.title}
          </h1>
          <div className="flex gap-4 justify-center mb-4">
            <select
              value={sortCategory}
              onChange={(e) => setSortCategory(e.target.value)}
              className="px-3 py-2 hidden md:block border rounded dark:bg-gray-300"
            >
              <option value="">{contents.categories}</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {(role === "admin" || role === "teacher") && (
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-2 text-sm lg:text-base text-white bg-blue-400 rounded hover:bg-blue-700"
              >
                <i className="fa-solid fa-plus" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex mr-5 justify-end mb-6 items-center md:hidden">
        <select
          value={sortCategory}
          onChange={(e) => setSortCategory(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-300"
        >
          <option value="">{contents.categories}</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="2xl:h-[88%] h-[75%] overflow-y-auto">
        {books.map((content) => (
          <div
            style={{ boxShadow: "1px 5px 6px rgba(0, 0, 0, 0.15)" }}
            key={content.id}
            className="w-5/6 flex flex-col mx-auto rounded-xl mb-5 bg-white dark:bg-gray-700"
          >
            <div className="flex flex-col md:flex-row">
              <div
                className="image_box w-full sm:w-[510px] 2xl:w-[630px] rounded-t-lg md:rounded-s-xl overflow-hidden"
                style={{
                  background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "230px",
                }}
              >
                <img
                  style={{ borderRadius: "inherit" }}
                  className="rounded-s-xl w-full h-full"
                  src={content.image}
                  alt={content.name}
                />
              </div>
              <div className="w-full flex justify-between">
                <div className="py-3 pt-1 px-4 flex flex-col">
                  <h1 className="uppercase mt-2 mb-2 font-bold text-xl cursor-default border-gray-300 dark:text-white">
                    {content.name}
                  </h1>
                  <span className="text-gray-800 mb-2 dark:text-amber-50">
                    {content.author}
                  </span>
                  <p className="dark:text-white font-serif">
                    {content.description.slice(0, 150)}
                    {content.description.length > 150 ? "..." : ""}
                  </p>
                  <div>
                    <a
                      href={content.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <button className="py-2 mb-3 mt-3 px-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600">
                        {contents.button}
                      </button>
                    </a>
                  </div>
                  <div className="flex gap-6 flex-wrap w-full">
                    <div className="flex items-center gap-1 dark:text-white">
                      <i className="fa fa-calendar"></i>
                      <p>{content.year}</p>
                    </div>
                    <div className="flex items-center gap-1 dark:text-white">
                      <i className="fa fa-globe"></i>
                      <p>{content.language}</p>
                    </div>
                    <div className="flex items-center gap-1 dark:text-white">
                      <i className="fa fa-bookmark"></i>
                      <p>{content.category}</p>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  {(role === "admin" || role === "teacher") && (
                    <button
                      onClick={() => handleOpenModal(content.id)}
                      className="m-4 bg-red-600 w-[30px] h-[30px] dark:text-gray-200 text-white rounded-md hover:bg-red-700"
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Modal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={handleUpdate}
      />
      
      <ConfirmDeleteModal
        isVisible={isModalVisible}
        content={bookToDelete}
        onDelete={handleDelete}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}

export default LibraryPage;