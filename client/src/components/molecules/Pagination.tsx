import React from 'react';
import Button from '../atoms/Button';
import Led from '../atoms/Led';
import '../../styles/components/_pagination.scss'; // Assuming styles exist or will be created

export interface PaginationProps {
    totalPages?: number;
    currentPage?: number;
    playingPage?: number;
    onPageSelect?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages = 4,
    currentPage = 0,
    playingPage = -1,
    onPageSelect
}) => {
    return (
        <div className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    variant={index === currentPage ? 'primary' : 'secondary'}
                    onClick={() => onPageSelect?.(index)}
                    aria-current={index === currentPage ? 'page' : undefined}
                    className="pagination__button"
                    style={{ position: 'relative' }} // Ensure positioning context
                >
                    {index + 1}
                    {(index === playingPage) && (
                        <div className="pagination__led pagination__led--active">
                            <Led active={true} size={6} color="#00ff00" />
                        </div>
                    )}
                </Button>
            ))}
        </div>
    );
};

export default Pagination;
