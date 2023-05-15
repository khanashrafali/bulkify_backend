import React from 'react';
import BreadCrumb from '~/components/elements/BreadCrumb';
import Venloginform from '~/pages/registration/venloginform';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import PageContainer from '~/components/layouts/PageContainer';
import Newsletters from '~/components/partials/commons/Newletters';

const vendors = () => {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Vendor Login',
        },
    ];

    return (
        <PageContainer footer={<FooterDefault />} title="Become a vendor">
            <div className="ps-page--single">
                <BreadCrumb breacrumb={breadCrumb} />
            </div>
            <Venloginform />
            <Newsletters layout="container" />
        </PageContainer>
    );
};

export default vendors;
