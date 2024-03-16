// import React, { useEffect, useState } from 'react';
// // import './Listening.scss';
// //the dates are on the left, persons are on the top
// const BookDistribution2 = ({ personNames, pagesPerDay, totalPages }) => {
//     const [distribution, setDistribution] = useState({});
//     const [dates, setDates] = useState([]);

//     useEffect(() => {
//         const distributePages = () => {
//             const result = {};
//             const currentDate = new Date();
//             const dateList = [];

//             for (
//                 let day = 1;
//                 day <=
//                 Math.ceil(totalPages / (personNames.length * pagesPerDay));
//                 day++
//             ) {
//                 const formattedDate = currentDate.toLocaleDateString('en-GB', {
//                     day: '2-digit',
//                     month: '2-digit',
//                     year: 'numeric'
//                 });
//                 dateList.push(formattedDate);
//                 result[formattedDate] = {};

//                 for (
//                     let personIndex = 0;
//                     personIndex < personNames.length;
//                     personIndex++
//                 ) {
//                     const personName = personNames[personIndex];
//                     const startPage =
//                         ((day - 1) * personNames.length + personIndex) *
//                             pagesPerDay +
//                         1;
//                     const endPage =
//                         (day * personNames.length + personIndex) * pagesPerDay;

//                     result[formattedDate][personName] = Array.from(
//                         { length: pagesPerDay },
//                         (_, index) => startPage + index
//                     );
//                 }

//                 currentDate.setDate(currentDate.getDate() + 1);
//             }

//             setDates(dateList);
//             setDistribution(result);
//         };

//         distributePages();
//     }, [personNames, pagesPerDay, totalPages]);

//     const renderTable = () => {
//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Date</th>
//                         {personNames.map((personName, index) => (
//                             <th key={index}>{personName}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {dates.map((date) => (
//                         <tr key={date}>
//                             <td>{date}</td>
//                             {personNames.map((personName, personIndex) => (
//                                 <td key={personIndex}>
//                                     {distribution[date][personName].join(', ')}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         );
//     };

//     return <div>{renderTable()}</div>;
// };
// //the dates are on the top, persons are on the left
// const BookDistribution3 = ({ personNames, pagesPerDay, totalPages }) => {
//     const [distribution, setDistribution] = useState({});
//     const [dates, setDates] = useState([]);

//     useEffect(() => {
//         const distributePages = () => {
//             const result = {};
//             const currentDate = new Date();
//             const dateList = [];

//             for (
//                 let day = 1;
//                 day <=
//                 Math.ceil(totalPages / (personNames.length * pagesPerDay));
//                 day++
//             ) {
//                 const formattedDate = currentDate.toLocaleDateString('en-GB', {
//                     day: '2-digit',
//                     month: '2-digit',
//                     year: 'numeric'
//                 });
//                 dateList.push(formattedDate);
//                 result[formattedDate] = {};

//                 for (
//                     let personIndex = 0;
//                     personIndex < personNames.length;
//                     personIndex++
//                 ) {
//                     const personName = personNames[personIndex];
//                     const startPage =
//                         ((day - 1) * personNames.length + personIndex) *
//                             pagesPerDay +
//                         1;
//                     const endPage =
//                         (day * personNames.length + personIndex) * pagesPerDay;

//                     result[formattedDate][personName] = Array.from(
//                         { length: pagesPerDay },
//                         (_, index) => startPage + index
//                     );
//                 }

//                 currentDate.setDate(currentDate.getDate() + 1);
//             }

//             setDates(dateList);
//             setDistribution(result);
//         };

//         distributePages();
//     }, [personNames, pagesPerDay, totalPages]);

//     const renderTable = () => {
//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         <th></th>
//                         {dates.map((date, index) => (
//                             <th key={index}>{date}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {personNames.map((personName, personIndex) => (
//                         <tr key={personIndex}>
//                             <td>{personName}</td>
//                             {dates.map((date, dateIndex) => (
//                                 <td key={dateIndex}>
//                                     {distribution[date][personName].join(', ')}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         );
//     };

//     return <div>{renderTable()}</div>;
// };

// export const Hatim: React.FC = (): JSX.Element => {
//     const personNames = [
//         'Hasan',
//         'Ugur',
//         'Vedat',
//         'Bekir',
//         'Cihat',
//         'Necdet',
//         'Hüseyin'
//     ];
//     return (
//         <div className="listening">
//             Listening page
//             <div>
//                 <h1>Book Distribution</h1>
//                 <BookDistribution2
//                     personNames={personNames}
//                     pagesPerDay={3}
//                     totalPages={603}
//                 />
//             </div>
//         </div>
//     );
// };
